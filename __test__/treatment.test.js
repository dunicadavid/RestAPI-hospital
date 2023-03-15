const request  = require('supertest');
const app = require('../server');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHJlZ2lzdHJhdGlvbiI6MTYsImVtYWlsIjoib2d2aWN0b3JAeWFob28uY29tIiwiaWF0IjoxNjc4ODgzMTczLCJleHAiOjE2Nzg4ODY3NzN9.36FAxsx1fQ8OGC0fjAQxSXzmrM9bQDbEO7E4rKlFq88";
const tokenAssistant = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHJlZ2lzdHJhdGlvbiI6NSwiZW1haWwiOiJnZW9yZ2lhbmEucGF1bkB5YWhvby5jb20iLCJpYXQiOjE2Nzg4Nzg4MjIsImV4cCI6MTY3ODg4MjQyMn0.SEA0OHyx2Tm8YsrmE6h-5ozBp87ybMXRjGWAwFuV41g";
const tokenDoctor = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHJlZ2lzdHJhdGlvbiI6MTMsImVtYWlsIjoiZ2Vvcmdlc3RvaWNhMTk1NkB5YWhvby5jb20iLCJpYXQiOjE2Nzg4ODE5OTgsImV4cCI6MTY3ODg4NTU5OH0.dlVtROriUsHqlMFCqGGvQGfqQ5j_s-fX3ZCKTODEAZ0";


describe("POST /treatment/create", () => {

     
    test("No token provided", async () => {
        const response = await request(app).post('/treatment/create');
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Access Denied. Provide JWT token.');
    });

    test("Wrong input data - doctor doesnt exist", async () => {
        const response = await request(app).post('/treatment/create').send({
            description : 'Tratament intravenos',
            doctor : 1000,
            pacient : 1
        }).set('Authorization', 'Bearer ' + tokenDoctor);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe(`There is no Employee with that Id.` );
    });

    test("POST Treatment", async () => {
        const response = await request(app).post('/treatment/create').send({
            description : 'Tratament intravenos',
            doctor : 3,
            pacient : 1
        }).set('Authorization', 'Bearer ' + tokenDoctor);
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Create Treatment Info Successfully');
    });
});

describe("GET /treatment/id=:id", () => {
     
    test("No token provided", async () => {
        const response = await request(app).get('/treatment/id=1');
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Access Denied. Provide JWT token.');
    });


    test("GET successful", async () => {
        const response = await request(app).get('/treatment/id=3')
        .set('Authorization', 'Bearer ' + token)
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Get Treatment Info Successfully');
    });


    test("GET failed - no such treatment", async () => {
        const response = await request(app).get('/treatment/id=1000')
        .set('Authorization', 'Bearer ' + token)
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('There is no Treatment with id: 1000');
    });
});

describe("PUT /treatment/update", () => {
     
    test("Token invalid", async () => {
        const response = await request(app).put('/treatment/update')
        .set('Authorization', 'Bearer ' + token + 'asdad')
        .send({
            idtreatment : 23,
            description : 'Tratament intravenos',
            doctor : 1,
            pacient : 1
        });
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Access Denied. Token not valid.');
    });


    test("Wrong input data - no such doctor", async () => {
        const response = await request(app).put('/treatment/update')
        .set('Authorization', 'Bearer ' + token)
        .send({
            idtreatment : 16,
            description : 'Tratament intravenos',
            doctor : 1000,
            pacient : 1000
        });
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe('There is no doctor with that Id.');
    });


    test("Update successful", async () => {
        const response = await request(app).put('/treatment/update')
        .set('Authorization', 'Bearer ' + token)
        .send({
            idtreatment : 1,
            description : 'Tratament intravenos',
            date: '15-05-2023',
            doctor : 2,
            pacient : 1
        });
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Update Treatment Info Successfully');
    });

});

describe("DELETE /treatment/delete", () => {
     
    test("Unauthorized user", async () => {
        const response = await request(app).delete('/treatment/delete')
        .set('Authorization', 'Bearer ' + tokenAssistant)
        .send({
            idtreatment : 23,
        });
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe("Unauthorized. You don't have the previlages.");
    });

    
    test("Wrong input data - test for id", async () => {
        const response = await request(app).delete('/treatment/delete')
        .set('Authorization', 'Bearer ' + token)
        .send({
            treatment : 23,
        });
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("Id must be a number.");
    });


    test("Delete successful", async () => {
        const response = await request(app).delete('/treatment/delete')
        .set('Authorization', 'Bearer ' + token)
        .send({
            idtreatment : 1,
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Delete Treatment Info Successfully');
    });

});

describe("PUT /treatment/applied", () => {
     
    test("Not Asisstant token", async () => {
        const response = await request(app).put('/treatment/applied')
        .send({
            idtreatment : 1,
            idemployee: 1
        })
        .set('Authorization', 'Bearer ' + token);
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe("Unauthorized. You don't have the previlages.");
    });


    test("Idemployee not Assistant check", async () => {
        const response = await request(app).put('/treatment/applied')
        .send({
            idtreatment : 1,
            idemployee: 2
        })
        .set('Authorization', 'Bearer ' + tokenAssistant);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe('Employee with id#2 is not an assistant.');
    });


    test("PUT successful", async () => {
        const response = await request(app).put('/treatment/applied')
        .send({
            idtreatment : 1,
            idemployee: 4
        })
        .set('Authorization', 'Bearer ' + tokenAssistant);
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Assistant Applied Treatment Successfully');  
    });
});
