let bookingId = '';
let headers = {};


describe('Testes para ver as reservas realizadas, as "booking"',() =>{

 // gerar um token antes dos testes   
  beforeEach(() => {
    cy.request({
      method: 'POST',
      url:'/auth',
      headers: { 'Content-type': 'application/json' },
      body: {
        username: "admin",
        password: "password123"
      }
    }).as('token');

  })

    it('Get de todos os id de todas as reservas ou "booking"',()=>{
    cy.request({
        method:'GET',
        url:'/booking',
        headers:{'Content-Type':'application/json'}
    }).then((response) =>{
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body).to.have.lengthOf.at.least(1);
        expect(response.body[0]).to.have.property('bookingid');
})
})

it('2 Get para trazer resultado utilizando o nome como parametro',() =>{
    cy.request({
        method:'GET',
        url:'/booking',
        qs: {'firstName' : 'Sally'},
        headers:{'Content-Type': 'application/json'}

    }).then((response)=>{
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body).to.have.lengthOf.at.least(1);
        expect(response.body[0]).to.have.property('bookingid');
    });

 })
 it('3 Get para trazer resultado utilizando data de chekin como parametro',() =>{
    cy.request({
        method: 'GET',
        url:'/booking',
        qs: { 'checkin' : '2014-05-21'},
        headers: { 'Content-Type': 'application/json'}
      }).then((response) => {	
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body).to.have.lengthOf.at.least(1);
        expect(response.body[0]).to.have.property('bookingid');
    });
})
it('4 - Get para buscar um booking usando id como parametro', () =>{
    cy.request({
        method: 'GET',
        url: '/booking/1',
        headers: {'Accept':'application/json'}
    }).then((response)=>{
        expect(response.status).to.eq(200);
        expect(response.headers).to.have.property('content-type','application/json; charset=utf-8');
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('firstname').and.to.be.a('string');
        expect(response.body).to.have.property('lastname').and.to.be.a('string');
        expect(response.body).to.have.property('totalprice').and.to.be.a('number');
        expect(response.body).to.have.property('depositpaid').and.to.be.a('boolean');
        expect(response.body).to.have.property('bookingdates').and.to.be.an('object');
        expect(response.body.bookingdates).to.have.property('checkin').and.to.be.a('string');
        expect(response.body.bookingdates).to.have.property('checkout').and.to.be.a('string');
    });
});
it('5 Post - Criar um booking',()=>{
    cy.request({
        method: 'POST',
        url: 'booking',
        headers: {'Content-Type' : 'application/json'},
        body: {
            "firstname" : "Rodrigo",
            "lastname" : "Cabral",
            "totalprice" : 500,
            "depositpaid" : true,
            "bookingdates" : {
            "checkin" : "2024-01-01",
            "checkout" : "2024-02-01"
            },
            addictionaneeds : "Breakfast"
             }
    }).then((response) =>{
        expect(response.status).to.eq(200);
        expect(response.headers).to.have.property('content-type', 'application/json; charset=utf-8');
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('bookingid').and.to.be.a('number');
        expect(response.body).to.have.property('booking').and.to.be.a('object');
        expect(response.body.booking).to.have.property('firstname', 'Rodrigo').and.to.be.a('string');
        expect(response.body.booking).to.have.property('lastname' , 'Cabral').and.to.be.a('string');
        expect(response.body.booking).to.have.property('totalprice').and.to.be.a('number');
        expect(response.body.booking).to.have.property('depositpaid').and.to.be.a('boolean');
        expect(response.body.booking).to.have.property('bookingdates').and.to.be.an('object');
        expect(response.body.booking.bookingdates).to.have.property('checkin').and.to.be.a('string');
        expect(response.body.booking.bookingdates).to.have.property('checkout').and.to.be.a('string');
        //criar um alias
        cy.wrap(response).as('bookingCreated', {type: 'static'});

    }).then(function () {
        cy.request({
            method: 'GET', 
            url:'/booking/'+this.bookingCreated.body.bookingid,
            headers:{'Accept': 'application/json'}
        })    
        .then((response) => {	
          expect(response.status).to.eq(200);
          expect(response.headers).to.have.property('content-type', 'application/json; charset=utf-8')
          expect(response.body).to.be.an('object');
          expect(response.body).to.have.property('firstname', 'Rodrigo').and.to.be.a('string');
          expect(response.body).to.have.property('lastname', 'Cabral').and.to.be.a('string');
          expect(response.body).to.have.property('totalprice').and.to.be.a('number');
          expect(response.body).to.have.property('depositpaid').and.to.be.a('boolean');
          expect(response.body).to.have.property('bookingdates').and.to.be.an('object');
          expect(response.body.bookingdates).to.have.property('checkin').and.to.be.a('string');
          expect(response.body.bookingdates).to.have.property('checkout').and.to.be.a('string');
        });
    });
});

it.only('7 - Update booking by id with authorization header', () => {
    cy.get('@token').then((token) => {
      cy.request({
        method: 'POST',
        url:'/booking',
        headers: { 'Content-Type': 'application/json'},
        body: {
          firstname: "Nina",
          lastname: "Cabral",
          totalprice: 200,
          depositpaid: false,
          bookingdates: {
              checkin: "2018-01-01",
              checkout: "2019-01-01"
          },
          additionalneeds: "Orange Juice"
        }
      }).then((response) => {
        cy.request({
          method: 'PUT',
          url:'/booking/'+ response.body.bookingid,
          auth:{ user: 'admin', password: 'password123'},
          headers: { 
          'Accept': 'application/json', 
          'Content-type': 'application/json',  
        },
        body: {
          firstname: "Nina",
          lastname: "Cabral da Silva",
          totalprice: 200,
          depositpaid: false,
          bookingdates: {
              checkin: "2018-01-01",
              checkout: "2019-01-01"
          },
          additionalneeds: "Orange Juice"
        },
          failOnStatusCode: false
        }).then((response) => {	
            expect(response.headers).to.have.property('content-type', 'application/json; charset=utf-8')
            expect(response.body).to.be.an('object');
          
        });
      });
    });
  });

});

// cy.getRequest('/booking/'+ this.bookingCreated.body.bookingid,{'Content-type':'application/json'})
 
