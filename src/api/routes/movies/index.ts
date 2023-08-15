import {Router} from 'express';
import validator from './movies.validator';
import queries from "@api/routes/movies/movies.queries";
import commands from "@api/routes/movies/movies.commands";

const moviesRouter = Router();

// QUERIES
// Fetch a specific movie by ID
moviesRouter.get('/:id', ...validator.validate('get'), queries.getById);
// List all movies
moviesRouter.get('/', queries.list);


// COMMANDS
// Create a new movie
moviesRouter.post('/', ...validator.validate('create'), commands.create);

// Update an existing movie by ID
moviesRouter.put('/:id', ...validator.validate('update'), commands.update);

// Delete a specific movie by ID
moviesRouter.delete('/:id', ...validator.validate('delete'), commands.delete);

// Clone a specific movie by ID
moviesRouter.post('/:id', ...validator.validate('get'), commands.clone);


export default moviesRouter;
