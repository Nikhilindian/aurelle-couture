import { formatPrice } from "./utils";

export { formatPrice };

export function formatPaiseToInr(paise: number): string {
  return formatPrice(paise);
}
