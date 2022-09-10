import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { diseaseState } from "../recoil/atoms";
import { useData } from "./data";

const decideOption = (o, f, resolve) => {
  if (o.id && o.id.toString() === f.id.toString()) {
    switch (o.type) {
      case "range":
        f.ranges.forEach((r) => {
          if (o.value?.a >= r.a && o.value?.b <= r.b) {
            const fscore = r.rate;
            return resolve(fscore);
          }
        });
        break;
      case "number":
        f.ranges.forEach((r) => {
          if (o.value >= r.a && o.value <= r.b) {
            const fscore = r.rate;
            return resolve(fscore);
          }
        });
        break;
      case "boolean":
      default:
        const fscore = (o.value ? 1 : 0) * f.rate || 0;
        return resolve(fscore);
    }
  }
};

const getFScore = async (f, data) => {
  // find matching id to factor
  const _fscore = await new Promise((resolve) => {
    data.forEach((i) => {
      decideOption(i, f, resolve);
      const options = i.options;
      if (Array.isArray(options)) {
        options.forEach((o) => {
          decideOption(o, f, resolve);
        });
      }
    });
    // if not found
    return resolve(0);
  });
  return _fscore;
};

const getFScores = async (d, data) => {
  const factors = d.factors;
  const _fscores = await Promise.all(factors.map((f) => getFScore(f, data)));
  const score = _fscores.reduce((a, b) => a + b);
  const result = Object.assign({}, d, { score });
  return result;
};

const updateScores = async (set, data, diseases) => {
  set([]);
  const _scores = await Promise.all(diseases.map((d) => getFScores(d, data)));
  set(_scores);
};

export function useScores() {
  const [data] = useData();
  const [scores, set] = useState([]);
  const diseases = useRecoilValue(diseaseState);

  useEffect(() => {
    updateScores(set, data, diseases);
    return () => set([]);
  }, [data, diseases]);

  return scores;
}
