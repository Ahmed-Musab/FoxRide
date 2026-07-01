const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const Module = require('module');


// Register require hook for .jsx and .js
require.extensions['.jsx'] = function (module, filename) {
  const content = fs.readFileSync(filename, 'utf8');
  const compiled = babel.transformSync(content, {
    filename,
    presets: [
      ['module:@react-native/babel-preset', { ts: false }]
    ]
  });
  module._compile(compiled.code, filename);
};

// Also compile files in src
const originalRequire = module.constructor.prototype.require;
module.constructor.prototype.require = function (filePath) {
  const resolved = Module._resolveFilename(filePath, this);
  if (!resolved.includes('node_modules') && (resolved.endsWith('.jsx') || resolved.endsWith('.js'))) {
    const content = fs.readFileSync(resolved, 'utf8');
    const compiled = babel.transformSync(content, {
      filename: resolved,
      presets: [
        ['module:@react-native/babel-preset', { ts: false }]
      ]
    });
    const m = new module.constructor(resolved, this);
    m.filename = resolved;
    m.paths = module.constructor._nodeModulePaths(path.dirname(resolved));
    m._compile(compiled.code, resolved);
    m.loaded = true;
    return m.exports;
  }
  return originalRequire.apply(this, arguments);
};

// Node module resolution helpers


// Mock React
const React = require('react');

// Mock react-native and other modules
const mocks = {
  'react-native': {
    StyleSheet: { create: (obj) => obj },
    View: 'View',
    Text: 'Text',
    TextInput: 'TextInput',
    TouchableOpacity: 'TouchableOpacity',
    ScrollView: 'ScrollView',
    Image: 'Image',
    KeyboardAvoidingView: 'KeyboardAvoidingView',
    Platform: { OS: 'android' },
    Modal: 'Modal',
    SafeAreaView: 'SafeAreaView',
  },
// Let's load real react navigation modules but keep react-native mocked

  '@hookform/resolvers/yup': {
    yupResolver: () => {},
  },
  'react-hook-form': {
    useForm: () => ({ control: {}, handleSubmit: () => {}, formState: { errors: {} } }),
    Controller: 'Controller',
  },
  'yup': {
    object: () => ({ shape: () => ({}) }),
    string: () => ({ email: () => ({ required: () => ({}) }), required: () => ({}) }),
    boolean: () => ({}),
  },
  '../context/authContext': {
    AuthContext: React.createContext({}),
    default: function AuthContextProvider({ children }) { return children; }
  },
  '../../context/authContext': {
    AuthContext: React.createContext({}),
    default: function AuthContextProvider({ children }) { return children; }
  },
  './src/context/authContext': {
    AuthContext: React.createContext({}),
    default: function AuthContextProvider({ children }) { return children; }
  }
};

// Set up require cache mocks
for (const [name, mockExports] of Object.entries(mocks)) {
  try {
    const resolvedPath = require.resolve(name);
    require.cache[resolvedPath] = {
      id: resolvedPath,
      filename: resolvedPath,
      loaded: true,
      exports: mockExports
    };
  } catch (e) {
    // If not installable or resolvable, override Module._load
  }
}

const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (mocks[request]) {
    return mocks[request];
  }
  // Try resolving local relative paths to our mocks if needed
  if (request.endsWith('authContext')) {
    return mocks['../context/authContext'];
  }
  return originalLoad.apply(this, arguments);
};

// Try importing App.jsx
try {
  console.log("Loading App.jsx...");
  require('./App.jsx');
  console.log("App.jsx loaded successfully!");
} catch (err) {
  console.error("CRITICAL ERROR during App.jsx load:");
  console.error(err);
}
