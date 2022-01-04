import ColorHash from 'color-hash'
import RandomColor from 'randomcolor';
const hash_to_color_hex = (str, lightness) => {
  let colorhash = new ColorHash({lightness: lightness});
  return colorhash.hex(str);
};

const random_color_hex = () => {
  return RandomColor();
};

export { hash_to_color_hex, random_color_hex };