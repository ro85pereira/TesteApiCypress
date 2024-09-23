describe('template spec', () => {
  it('1 POST com solicitação de token com sucesso - 1° versão', () => {
    cy.request({
      method:'POST',
      url:'https://restful-booker.herokuapp.com/auth',
      body:{
    "username" : "admin",
    "password" : "password123"
            },
      headers:{ 'Content-Type':'application/json'},
      failOnStatusCode: false
    }).then((response)=>{
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('token').and.to.be.a('string');
      expect(response.body).not.to.be.empty;

    });
  });
  it.only('2 POST Realizar a solicitação de token com custom comands',() =>{
    let body = {
      "username": "admin",
      "password": "password123"
  };
    cy.postRequest(Cypress.env('auth_url'),{"Content-type":"application/json"},body)
    .then((response)=>{
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('token').and.to.be.a('string');
      expect(response.body).not.to.be.empty;
    });
  });

})
