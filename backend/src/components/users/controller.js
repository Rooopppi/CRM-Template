import { generateBasicFunctions } from '../../shared/basicComponent.js';
import Users from './component.js';

const { search, create, remove, update } = generateBasicFunctions(Users);

export default { search, create, remove, update };
