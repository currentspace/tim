import { memo, splitProps } from '../helpers.mjs';
import { createRecipe, mergeRecipes } from './create-recipe.mjs';

const typographyFn = /* @__PURE__ */ createRecipe('typography', {
  "variant": "dataValue",
  "color": "primary"
}, [])

const typographyVariantMap = {
  "variant": [
    "editorialDisplay",
    "pageTitle",
    "sectionHeader",
    "sectionTitle",
    "companyTitle",
    "dataValue",
    "dataLabel",
    "captionText",
    "timelineLabel",
    "navTab",
    "badgeText",
    "toggleLabel",
    "backButton"
  ],
  "size": [
    "xs",
    "sm",
    "base",
    "lg",
    "xl",
    "2xl",
    "3xl"
  ],
  "weight": [
    "regular",
    "medium",
    "semibold",
    "bold"
  ],
  "color": [
    "primary",
    "secondary",
    "muted",
    "accent",
    "orange",
    "white",
    "alert"
  ],
  "align": [
    "left",
    "center",
    "right"
  ],
  "m": [
    "0",
    "1",
    "2",
    "3",
    "4",
    "xs",
    "sm",
    "md",
    "lg",
    "xl"
  ],
  "mb": [
    "0",
    "1",
    "2",
    "3",
    "4",
    "xs",
    "sm",
    "md",
    "lg",
    "xl"
  ],
  "mt": [
    "0",
    "1",
    "2",
    "3",
    "4",
    "xs",
    "sm",
    "md",
    "lg",
    "xl"
  ],
  "transform": [
    "none",
    "uppercase",
    "lowercase",
    "capitalize"
  ]
}

const typographyVariantKeys = Object.keys(typographyVariantMap)

export const typography = /* @__PURE__ */ Object.assign(memo(typographyFn.recipeFn), {
  __recipe__: true,
  __name__: 'typography',
  __getCompoundVariantCss__: typographyFn.__getCompoundVariantCss__,
  raw: (props) => props,
  variantKeys: typographyVariantKeys,
  variantMap: typographyVariantMap,
  merge(recipe) {
    return mergeRecipes(this, recipe)
  },
  splitVariantProps(props) {
    return splitProps(props, typographyVariantKeys)
  },
  getVariantProps: typographyFn.getVariantProps,
})