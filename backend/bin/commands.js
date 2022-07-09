import _ from 'lodash';
import 'dotenv/config.js';
import Aigle from 'aigle';
import { program } from 'commander';
import { files } from '../src/shared/index.js';
import ServicesManager from '../src/services/index.js';

const main = async () => {
  const cliCommands = files.globFiles('/src/commands/**/*.js');
  await ServicesManager.startServices(true);
  await Aigle.each(cliCommands, async (command) => {
    const { commandName, commandFunction } = await import(`file:///${command}`);
    program.command(commandName).action(async () => {
      try {
        const commandResult = await commandFunction(process.argv.slice(3));
        process.exit(commandResult);
      } catch (error) {
        console.error(error);
        process.exit(1);
      }
    });
  });
  program.parseAsync(process.argv);
};

main();
