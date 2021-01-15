import 'reflect-metadata';
import { Container } from 'typedi';
import { useContainer } from 'typeorm';
import { startApp } from './app'

useContainer(Container);

startApp()
  .then(() => console.log(`App finished running successfully.`))
  .catch(error => {
    console.error(`Ohh noo! Error while running the app!`);
    console.error(error);
    /** We exit with error code so tests will fail. */
    process.exit(-1);
  });