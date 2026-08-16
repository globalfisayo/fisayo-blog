import React from 'react';
import { motion as framerMotion } from 'framer-motion';
import { shouldAnimate } from './motionSession';

// A drop-in stand-in for framer-motion's `motion`. Components import it exactly
// as before, but once the session's opening animation has been seen (see
// motionSession.js) the entrance props are dropped and elements render in their
// final state immediately.
//
// Hover and tap props are deliberately left untouched: those fire because the
// visitor asked for them, so they stay lively for the whole visit.
const ENTRANCE_PROPS = [
  'initial',
  'animate',
  'whileInView',
  'exit',
  'variants',
  'transition',
  'viewport',
];

const cache = new Map();

const wrap = (Component) =>
  React.forwardRef(function SettledMotion(props, ref) {
    if (shouldAnimate()) return <Component ref={ref} {...props} />;

    const rest = {};
    for (const key of Object.keys(props)) {
      if (!ENTRANCE_PROPS.includes(key)) rest[key] = props[key];
    }
    return <Component ref={ref} {...rest} />;
  });

export const motion = new Proxy(
  {},
  {
    get(_target, key) {
      // Only element shorthands (motion.div, motion.section, ...) are proxied.
      if (typeof key !== 'string' || !framerMotion[key]) return undefined;
      if (!cache.has(key)) cache.set(key, wrap(framerMotion[key]));
      return cache.get(key);
    },
  },
);

export default motion;
