const request  = require('supertest');
const app = require('../server');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHJlZ2lzdHJhdGlvbiI6MTYsImVtYWlsIjoib2d2aWN0b3JAeWFob28uY29tIiwiaWF0IjoxNjc4ODc4NzE2LCJleHAiOjE2Nzg4ODIzMTZ9._9eqy7zN-XlWIGcoUcLV03pP2i7sRoM3ilY2neZxSVo";
const tokenAssistant = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHJlZ2lzdHJhdGlvbiI6NSwiZW1haWwiOiJnZW9yZ2lhbmEucGF1bkB5YWhvby5jb20iLCJpYXQiOjE2Nzg4Nzg4MjIsImV4cCI6MTY3ODg4MjQyMn0.SEA0OHyx2Tm8YsrmE6h-5ozBp87ybMXRjGWAwFuV41g";

describe("POST /pacient/create", () => {

     
    test("No token provided", async () => {
        const response = await request(app).post('/pacient/create');
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Access Denied. Provide JWT token.');
    });

    test("Wrong input data - test for age", async () => {
        const response = await request(app).post('/pacient/create').send({
            name : "Andrei Dumitru",
            age: "12",
            illness: "Fractura femurala"
        }).set('Authorization', 'Bearer ' + token);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe('Age must be a number.');
    });

    test("Register successful", async () => {
        const response = await request(app).post('/pacient/create').send({
            name : "Andrei Dumitru",
            age: 12,
            illness: "Fractura femurala"
        }).set('Authorization', 'Bearer ' + token);
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Create Pacient Info Successfully');
    });
});

describe("GET /pacient/id=:id", () => {
     
    test("No token provided", async () => {
        const response = await request(app).get('/pacient/id=1');
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Access Denied. Provide JWT token.');
    });


    test("GET successful", async () => {
        const response = await request(app).get('/pacient/id=1')
        .set('Authorization', 'Bearer ' + token)
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Get Pacient Info Successfully');
    });


    test("GET failed - no such pacient", async () => {
        const response = await request(app).get('/pacient/id=1000')
        .set('Authorization', 'Bearer ' + token)
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('There is no Pacient with id: 1000');
    });
});

describe("PUT /pacient/update", () => {
     
    test("Token invalid", async () => {
        const response = await request(app).put('/pacient/update')
        .set('Authorization', 'Bearer ' + token + 'asdad')
        .send({
            idpacient : 23,
            name : "Andrei Dumitru",
            age: 12,
            illness: "Fractura femurala"
        });
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Access Denied. Token not valid.');
    });


    test("Wrong input data - test for illness", async () => {
        const response = await request(app).put('/pacient/update')
        .set('Authorization', 'Bearer ' + token)
        .send({
            idpacient : 1,
            name : "Andrei Dumitru",
            age: 12,
            illness: 123
        });
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe('Illness must be a string.');
    });


    test("Update successful", async () => {
        const response = await request(app).put('/pacient/update')
        .set('Authorization', 'Bearer ' + token)
        .send({
            idpacient : 1,
            name : "Andrei Dumitru",
            age: 12,
            illness: "Fractura femurala"
        });
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Update Pacient Info Successfully');
    });

});

describe("DELETE /pacient/delete", () => {
     
    test("Unauthorized user", async () => {
        const response = await request(app).delete('/pacient/delete')
        .set('Authorization', 'Bearer ' + tokenAssistant)
        .send({
            idpacient : 23,
        });
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe("Unauthorized. You don't have the previlages.");
    });

    
    test("Wrong input data - test for id", async () => {
        const response = await request(app).delete('/pacient/delete')
        .set('Authorization', 'Bearer ' + token)
        .send({
            pacient : 23,
        });
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("Id must be a number.");
    });


    test("Delete successful", async () => {
        const response = await request(app).delete('/pacient/delete')
        .set('Authorization', 'Bearer ' + token)
        .send({
            idpacient : 23,
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Delete Pacient Info Successfully');
    });

});

describe("PUT /pacient/assign-assistant", () => {
     
    test("No token provided", async () => {
        const response = await request(app).put('/pacient/assign-assistant')
        .send({
            idpacient : 1,
            idemployee: 1
        });
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Access Denied. Provide JWT token.');
    });


    test("Idemployee not Assistant check", async () => {
        const response = await request(app).put('/pacient/assign-assistant')
        .send({
            idpacient : 1,
            idemployee: 2
        })
        .set('Authorization', 'Bearer ' + token);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe('Employee with id#2 is not an assistant.');
    });


    test("PUT successful", async () => {
        const response = await request(app).put('/pacient/assign-assistant')
        .send({
            idpacient : 1,
            idemployee: 4
        })
        .set('Authorization', 'Bearer ' + token);
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Assistant Assigned Successfully');  
    });
});
