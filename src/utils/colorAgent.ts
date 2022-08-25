import ColorHash from "color-hash";
import RandomColor from "randomcolor";

const hash_to_color_hex = (
  str: string,
  lightness: number,
  saturation = 0.5
) => {
  const colorhash = new ColorHash({
    lightness: lightness,
    saturation: saturation,
  });
  return colorhash.hex(str);
};

const hash_to_color_hex_with_hue = (
  str: string,
  hue: {
    min: number;
    max: number;
  }
) => {
  const colorhash = new ColorHash({ hue: hue });
  return colorhash.hex(str);
};

const random_color_hex = () => {
  return RandomColor();
};

export { hash_to_color_hex, hash_to_color_hex_with_hue, random_color_hex };
