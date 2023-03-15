const request  = require('supertest');
const app = require('../server');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHJlZ2lzdHJhdGlvbiI6MTYsImVtYWlsIjoib2d2aWN0b3JAeWFob28uY29tIiwiaWF0IjoxNjc4ODc4NzE2LCJleHAiOjE2Nzg4ODIzMTZ9._9eqy7zN-XlWIGcoUcLV03pP2i7sRoM3ilY2neZxSVo";
const tokenAssistant = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHJlZ2lzdHJhdGlvbiI6NSwiZW1haWwiOiJnZW9yZ2lhbmEucGF1bkB5YWhvby5jb20iLCJpYXQiOjE2Nzg4Nzg4MjIsImV4cCI6MTY3ODg4MjQyMn0.SEA0OHyx2Tm8YsrmE6h-5ozBp87ybMXRjGWAwFuV41g";

describe("GET /employee/login", () => {
    test("Wrong input data - test for email", async () => {
        const response = await request(app).get('/employee/login').send({
            email : "ogvictoryahoo.com",
            password: ""
        });
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe('Email not valid.');
    });


    test("Email not registered", async () => {
        const response = await request(app).get('/employee/login').send({
            email : "mailnreinregistrat@yahoo.com",
            password: "parolagresita"
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Invalid email");
    });


    test("Wrong password", async () => {
        const response = await request(app).get('/employee/login').send({
            email : "ogvictor@yahoo.com",
            password: "parolagresita"
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Password and email doesn't match");
    });


    test("Login Successful", async () => {
        const response = await request(app).get('/employee/login').send({
            email : "ogvictor@yahoo.com",
            password: "123123"
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Login successfully");
    });
});

describe("POST /employee/register", () => {
    test("Wrong input data - test for role", async () => {
        const response = await request(app).post('/employee/register').send({
            email : "laur.1234@yahoo.ro",
            name : "Laurentiu Ionescu",
            password: "123123",
            role: "Portar"
        });
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe('The role is not valid.');
    });


    test("Email already in-use", async () => {
        const response = await request(app).post('/employee/register').send({
            email : "ogvictor@yahoo.com",
            name : "Laurentiu Ionescu",
            password: "123123",
            role: "Assistant"
        });
        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Email is already in-use');
    });


    test("Register successful", async () => {
        const response = await request(app).post('/employee/register').send({
            email : "vadim69op@yahoo.ro",
            name : "Vadim Oprisan",
            password: "123123",
            role: "Doctor"
        });
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Employee Created Successfully');
    });
});

describe("GET /employee/id=:id", () => {
     
    test("No token provided", async () => {
        const response = await request(app).get('/employee/id=3');
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Access Denied. Provide JWT token.');
    });


    test("GET successful", async () => {
        const response = await request(app).get('/employee/id=3')
        .set('Authorization', 'Bearer ' + token)
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Get Employee Info Successfully');
    });


    test("GET failed - no such user", async () => {
        const response = await request(app).get('/employee/id=1')
        .set('Authorization', 'Bearer ' + token)
        expect(response.statusCode).toBe(406);
        expect(response.body.message).toBe('There is no Employee with id: 1');
    });
});

describe("PUT /employee/update", () => {
     
    test("Token invalid", async () => {
        const response = await request(app).put('/employee/update')
        .set('Authorization', 'Bearer ' + token + 'asdad')
        .send({
            idemployee : 23,
            name : "Laurentiu Ionescu",
            role: "Assistant"
        });
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Access Denied. Token not valid.');
    });


    test("Wrong input data - test for id", async () => {
        const response = await request(app).put('/employee/update')
        .set('Authorization', 'Bearer ' + token)
        .send({
            idemployee : "23",
            name : "Laurentiu Ionescu",
            role: "Assistant"
        });
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe('Id must be a number.');
    });


    test("Update successful", async () => {
        const response = await request(app).put('/employee/update')
        .set('Authorization', 'Bearer ' + token)
        .send({
            idemployee : 23,
            name : "Laurentiu Ionescu",
            role: "Assistant"
        });
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Update Employee Info Successfully');
    });

});

describe("DELETE /employee/delete", () => {
     
    test("Unauthorized user", async () => {
        const response = await request(app).delete('/employee/delete')
        .set('Authorization', 'Bearer ' + tokenAssistant)
        .send({
            idemployee : 23,
        });
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe("Unauthorized. You don't have the previlages.");
    });

    
    test("Wrong input data - test for id", async () => {
        const response = await request(app).delete('/employee/delete')
        .set('Authorization', 'Bearer ' + token)
        .send({
            idemployee : "23",
        });
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("Id must be a number.");
    });


    test("Delete successful", async () => {
        const response = await request(app).delete('/employee/delete')
        .set('Authorization', 'Bearer ' + token)
        .send({
            idemployee : 23,
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Delete Employee Info Successfully');
    });

});

describe("GET /employee/report", () => {
     
    test("No token provided", async () => {
        const response = await request(app).get('/employee/report?page=1&limit=10');
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Access Denied. Provide JWT token.');
    });


    test("Wrong input data - test pagination params", async () => {
        const response = await request(app).get('/employee/report?page=asd&limit=2a')
        .set('Authorization', 'Bearer ' + token)
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe('Page parameter must be a number.');
    });


    test("GET successful", async () => {
        const response = await request(app).get('/employee/report?page=1&limit=10')
        .set('Authorization', 'Bearer ' + token)
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Get Doctors Report Successfully');  //daca in db nu sunt doctori primeste "There are no doctors as employees"
    });
});
