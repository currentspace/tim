import { memo, splitProps } from '../helpers.mjs';
import { createRecipe, mergeRecipes } from './create-recipe.mjs';

const flexFn = /* @__PURE__ */ createRecipe('flex', {
  "direction": "row",
  "align": "stretch",
  "justify": "start",
  "wrap": "nowrap"
}, [])

const flexVariantMap = {
  "direction": [
    "row",
    "column",
    "rowReverse",
    "columnReverse"
  ],
  "align": [
    "start",
    "center",
    "end",
    "stretch",
    "baseline"
  ],
  "justify": [
    "start",
    "center",
    "end",
    "between",
    "around",
    "evenly"
  ],
  "wrap": [
    "wrap",
    "nowrap",
    "reverse"
  ],
  "gap": [
    "none",
    "xs",
    "sm",
    "md",
    "lg",
    "xl",
    "2xl"
  ],
  "grow": [
    "0",
    "1"
  ],
  "shrink": [
    "0",
    "1"
  ]
}

const flexVariantKeys = Object.keys(flexVariantMap)

export const flex = /* @__PURE__ */ Object.assign(memo(flexFn.recipeFn), {
  __recipe__: true,
  __name__: 'flex',
  __getCompoundVariantCss__: flexFn.__getCompoundVariantCss__,
  raw: (props) => props,
  variantKeys: flexVariantKeys,
  variantMap: flexVariantMap,
  merge(recipe) {
    return mergeRecipes(this, recipe)
  },
  splitVariantProps(props) {
    return splitProps(props, flexVariantKeys)
  },
  getVariantProps: flexFn.getVariantProps,
})