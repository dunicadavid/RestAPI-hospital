# RestAPI-hospital

Pachete utilizate:
    -> "bcrypt": "^5.1.0",
    -> "dotenv": "^16.0.3",
    -> "express": "^4.18.2",
    -> "helmet": "^6.0.1",
    -> "http": "^0.0.1-security",
    -> "jsonwebtoken": "^9.0.0",
    -> "mysql2": "^3.2.0",
    -> "nodemon": "^2.0.21"
    -> "jest": "^29.5.0",
    -> "supertest": "^6.3.3"

Arhitectura utilizata: un restAPI realizat in NodeJS cu Express si MySQL pentru stocarea datelor.

Am impartit aplicatia in 4 foldere : routes (este handlerul pentru rutele requesturilor), controller (logica propriu zisa cu functiile (req,res,next)),
models (contine clase cu constructori si metode in interiorul carora se fac queryurile pentru baza de date) si \_test\_ ce contine testele pentru integritatea requesturilor.

Avem 4 metode de MIDDLEWARE :
    -> decodeToken: verifica daca requestul se face de catre un angajat authentificat (tokenul se transmite prin _req.headers.authorization_).
    -> authorizeCheck: verifica daca angajatul are permisiunea sa faca acel request (se decodeaza tokenul si se ia din baza de date rolul id-ului ce reiese din decodare, ca mai apoi sa se verifice daca este inclus in lista de prioritati).
    -> verifyIfIdIsAssistant: se verifica daca id-ul furnizat in body indeplineste contitia ca ii apartine unui asistent (se verifica in db).
    -> verifyIfIdIsDoctor: se verifica daca id-ul furnizat in body indeplineste contitia ca ii apartine unui doctor (se verifica in db).

Requesturi:<br />
    -> \*employee/login*  : nu necesita middleware, se da un body cu email si parola si se returneaza un json unde se gaseste token-ul.
    -> \*employee/register*  : nu necesita middleware, se da un body cu email, parola, nume, rol ca acestea sa fie introduse in baza de
    date dupa ce parola este incriptata.
    -> \*employee/id=:id* \*employee/update* \*employee/delete* operatiile CRUD,
    aceste requesturi necesita 2 middlewareuri : decodeToken si apoi authorizeCheck(['General manager']).
    -> \*employee/report?page= &limit= * : necesita aceleasi doua middlewareuri ca mai sus; este de mentionat ca am introdus si
    paginare avand in vedere ca lista poate deveni foarte lunga.
    -> \*pacient/create* \*pacient/id=:id* \*pacient/update* \*pacient/delete* : operatiile CRUD pentru managementul pacientilor, necesita 
    doua middelwareuri: decodeToken si apoi authorizeCheck(['General manager', 'Doctor']).
    -> \*pacient/report?page= &limit= * : ofera istoricul medical al unui pacient primit in body, necesita doua middelwareuri: decodeToken 
    si apoi authorizeCheck(['General manager', 'Doctor']), de asemenea contine paginare.
    -> \*pacient/assign-assistant* : aceleasi doua middlewares ca mai sus plus verifyIfIdIsAssistant, deoarece trebuie asigurat ca sunt 
    asignati doar asistenti.
    -> \*treatment/create*: tratamentul poate fi creat doar de un doctor, astfel utilizam 3 middlewares: decodeToken si apoi 
    authorizeCheck(['Doctor']) si verifyIfIdIsDoctor (pentru a ne asigura ca id-ul trimis in body este al unui doctor).
    -> \*treatment/id=:id* \*treatment/update* \*treatment/delete* :Operatiile CRUD pentru managementul tratamentelor, gestinate de doctor si
    managerul general
    -> \*treatment/applied* : poate fi realizat doar de asistent, deci folosim 3 middlewares: decodeToken si apoi authorizeCheck(['Assistant']) si 
    verifyIfIdIsAssistant


Baza de date contine 4 tabele:

    registration (idregistration(PK), email (VARCHAR UNIQUE), password (VARCHAR-encriped String))

    employee (idemployee (FK =idregistration), name (VARCHAR), role (VARCHAR [General manager, Doctor, Assistant]))

    pacient (idpacient(PK), name(VARCHAR), age(INT), illness(VARCHAR), assistantAssigned(FK =idemplyee))

    treatment (idtreatment(PK), description(VARCHAR), date(VARCHAR), doctor(FK =idemployee), pacinet(FK = idpacinet), appliedBy(NULL, FK =idemployee))

Vulnerabilitati:
    -> de securitate: nu avem refresh token, acesta este setat sa persiste 1h
    -> nu este tratat cazul in care se fac modificari la id-uri care nu mai exista, insa nu pot fi asignate id-uri care nu mai exista (acest caz este tratat -> foreignkey exception).