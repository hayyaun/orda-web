import { useRecoilState } from "recoil";
import { treeState } from "../recoil/atoms";

export function useExpanded() {
  const [expanded, set] = useRecoilState(treeState);
  const toggle = (id) => {
    set((s) => {
      const list = new Set(s);
      if (list.has(id)) list.delete(id);
      else list.add(id);
      return Array.from(list);
    });
  };
  return [expanded, toggle];
}
