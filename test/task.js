// npm install mocha --save-dev (JavaScript testing framework)
// npm install chai --save-dev (JavaScript assertion library)
// --save-dev (save under dev dependency in package.json, will not include in production)

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
const { response } = require('express');

// select assert style -> should()
chai.should();

// use http to test rest api
chai.use(chaiHttp);

describe('Test tasks APIs', () => {
    /**
     * Test the get route
     */
    describe('GET /api/tasks', () => {
        it('It should get all the tasks', (done) => {
            chai.request(server)
                .get('/api/tasks')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    response.body.length.should.be.eq(3);
                    done();
                });
        });

        it('It should not get all the tasks', (done) => {
            chai.request(server)
                .get('/api/task')
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                });
        });
    });

    /**
     * Test the "get by id" route
     */
    describe('GET /api/tasks/:id', () => {
        it('It should get the task with the given id', (done) => {
            const taskId = 1;
            chai.request(server)
                .get('/api/tasks/' + taskId)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('id');
                    response.body.should.have.property('name');
                    response.body.should.have.property('completed');
                    response.body.should.have.property('id').eq(taskId);
                    done();
                });
        });

        it('It should not get any task with the id that dose not exist', (done) => {
            const taskId = 100;
            chai.request(server)
                .get('/api/tasks/' + taskId)
                .end((err, response) => {
                    response.should.have.status(404);
                    response.text.should.eq("The task with the provided ID does not exist.");
                    done();
                });
        });
    });

    /**
     * Test the post route
     */
    describe('POST /api/tasks/', () => {
        it('It should post a new task', (done) => {
            const newTask = {
                name: "Task 4",
                completed: false
            };

            chai.request(server)
                .post('/api/tasks')
                .send(newTask)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('id');
                    response.body.should.have.property('name');
                    response.body.should.have.property('completed');
                    response.body.should.have.property('id').eq(4);
                    response.body.should.have.property('name').eq(newTask.name);
                    response.body.should.have.property('completed').eq(newTask.completed);
                    done();
                });
        });

        it('It should not post a new task without name or name less than 3 char', (done) => {
            const newTask = {
                completed: false,
            };
            chai.request(server)
                .post('/api/tasks')
                .send(newTask)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.eq("The name should be at least 3 chars long!");
                    done();
                });
        });
    });

    /**
     * Test the put route
     */
    describe('PUT /api/tasks/:id', () => {
        it("It should update an existing task", (done) => {
            const taskId = 1;
            const updatedTask = {
                name: "New Task 1",
                completed: true
            };

            chai.request(server)
                .put('/api/tasks/' + taskId)
                .send(updatedTask)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('id');
                    response.body.should.have.property('name');
                    response.body.should.have.property('completed');
                    response.body.should.have.property('id').eq(taskId);
                    response.body.should.have.property('name').eq(updatedTask.name);
                    response.body.should.have.property('completed').eq(updatedTask.completed);
                    done();
                });
        });

        it("It should not update any task if the given id does not exist", (done) => {
            const taskId = 100;
            const updatedTask = {
                name: "New Task 100",
                completed: true
            };

            chai.request(server)
                .put('/api/tasks/' + taskId)
                .send(updatedTask)
                .end((err, response) => {
                    response.should.have.status(404);
                    response.text.should.eq("The task with the provided ID does not exist.");
                    done();
                });
        });

        it("It should not update any task if the given name less than 3 char", (done) => {
            const taskId = 2;
            const updatedTask = {
                name: "cx",
                completed: true
            };

            chai.request(server)
                .put('/api/tasks/' + taskId)
                .send(updatedTask)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.eq("The name should be at least 3 chars long!");
                    done();
                });
        });
    });

    /**
     * Test the patch route
     */
    describe('PATCH /api/tasks/:id', () => {
        it('It should patch an eixtsing task', (done) => {
            const taskId = 1;
            const updatedTask = {
                name: "New task 1 changed"
            };

            chai.request(server)
                .patch('/api/tasks/' + taskId)
                .send(updatedTask)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('id');
                    response.body.should.have.property('name');
                    response.body.should.have.property('completed');
                    response.body.should.have.property('id').eq(taskId);
                    response.body.should.have.property('name').eq(updatedTask.name);
                    response.body.should.have.property('completed').eq(true);
                    done();
                });
        });

        it("It should not patch an existing task with name less than 3 char", (done) => {
            const taskId = 1;
            const updatedTask = {
                name: "cx"
            };

            chai.request(server)
                .patch('/api/tasks/' + taskId)
                .send(updatedTask)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.eq("The name should be at least 3 chars long!");
                    done();
                });
        });

        it("It should not patch an existing task with id that does not exist", (done) => {
            const taskId = 100;
            const updatedTask = {
                name: "New task"
            };

            chai.request(server)
                .patch('/api/tasks/' + taskId)
                .send(updatedTask)
                .end((err, response) => {
                    response.should.have.status(404);
                    response.text.should.eq("The task with the provided ID does not exist.");
                    done();
                });
        });
    });
    
    /**
     * Test the delete route
     */
    describe('DELETE /api/tasks/:id', () => {
        it('It should delete the existing task with the given id', (done) => {
            const taskId = 1;
            chai.request(server)
                .delete('/api/tasks/' + taskId)
                .end((err, response) => {
                    response.should.have.status(200);
                    done();
                });
        });

        it("It should not delete any task with the id that does not exist", (done) => {
            const taskId = 100;
            chai.request(server)
                .delete('/api/tasks/' + taskId)
                .end((err, response) => {
                    response.should.have.status(404);
                    response.text.should.eq("The task with the provided ID does not exist.");
                    done();
                });
        });
    });
});



