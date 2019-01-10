export const APOLLO_MORPHER_COMPATIBLE = `[**apollo-morpher**](https://www.npmjs.com/package/apollo-morpher) compatible.`;

export const DOCUMENTATION_FETCH = `
"""
${APOLLO_MORPHER_COMPATIBLE}

The payload is an EJSON string that accepts "filters", "options" and other keys that are passed as params to Grapher.

Example of payload:\n
"{\\\\"filters\\\\": \\\\"{}\\\\", \\\\"options\\\\": \\\\"{}\\\\" }"
"""
`;

export const DOCUMENTATION_INSERT = `
"""
${APOLLO_MORPHER_COMPATIBLE}

The payload is an EJSON string that accepts the full document

Example of payload:\n
"{\\\\"field\\\\": \\\\"value\\\\" }"
"""
`;

export const DOCUMENTATION_UPDATE = `
"""
${APOLLO_MORPHER_COMPATIBLE}

The payload is an EJSON string that accepts "selector" and "modifier" as keys.

Example of payload:\n
"{\\\\"selector\\\\": \\\\"{}\\\\", \\\\"modifier\\\\": \\\\"{}\\\\" }"
"""
`;

export const DOCUMENTATION_REMOVE = `
"""
${APOLLO_MORPHER_COMPATIBLE}

The payload is an EJSON string that accepts "selector" key.

Example of payload:\n
"{\\\\"selector\\\\": \\\\"{}\\\\" }"
"""
`;
