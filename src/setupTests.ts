import "@testing-library/jest-dom";
import { TextDecoder } from 'util';
import { mockReactMapGl } from "./__test_helpers__/react-map-gl-mock";

Object.assign(global, { TextDecoder });

mockReactMapGl();