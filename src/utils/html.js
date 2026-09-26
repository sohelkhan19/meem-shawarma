import htm from "../../vendor/htm.module.js";

const React = window.React;
export const html = htm.bind(React.createElement);
export { React };
export const { useState, useEffect, useRef, useMemo, useCallback } = React;
