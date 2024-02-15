describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'jan kat',
      username: 'jan kat',
      password: 'hallo123'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user)
    cy.visit('')
  })

  it('front page can be opened', function () {
    cy.contains('Blogs')
  })
  it('Login form is shown', function() {
    cy.contains('log in to application')
  })
  it('login form can be opened', function () {
    cy.contains('cancel').click()
    cy.get('#username').should('not.contain')
    cy.get('#password').should('not.contain')
    cy.contains('logIn').click()
    cy.get('#username').type('jan kat')
    cy.get('#password').type('hallo123')
    cy.get('#login-button').click()

    cy.contains('jan kat logged in')
  })
  it('login fails with wrong password', function () {
    // cy.contains('logIn').click()
    cy.get('#username').type('jan kat')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.get('.error').should('contain', 'Wrong credentials')
      .should('have.css', 'color', 'rgb(255, 0, 0)')
      .should('have.css', 'border-style', 'solid')

    cy.get('html').should('not.contain', 'jan kat logged in')
  })
  describe('when logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'jan kat', password: 'hallo123' })
    })

    it('A blog can be created', function () {
      cy.contains('Create Blog').click()
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('cypress')
      cy.get('#url').type('www.cypress.com')
      cy.get('#blog-save-button').click()
      cy.contains('a blog created by cypress')
    })
  })

  describe('and a blog exists', function () {
    beforeEach(function () {
      cy.login({ username: 'jan kat', password: 'hallo123' })
      cy.createBlog({
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'https://test.url',
        likes: 20
      })
    })
    it('a blog exists', function () {
      cy.contains('Type wars By Robert C. Martin')
    })
    it('the like button can be pressed', function () {
      cy.contains('View').click()
      cy.contains('likes: 20')
      cy.contains('Like').click()
      cy.contains('likes: 21')
    })
    it('A blog can be deleted', function () {
      cy.contains('View').click()
      cy.contains('Delete').click()
      cy.get('html').should('not.contain', 'Type wars By Robert C. Martin')
    })
    it('Only the creater can se the delete button', function () {
      const user = {
        name: 'piet kat',
        username: 'piet kat',
        password: 'hallo123'
      }
      cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user)

      cy.login({ username: 'piet kat', password: 'hallo123' })

      cy.contains('View').click()
      cy.get('html').should('not.contain', 'Delete')
      cy.get('html').should('contain', 'Type wars By Robert C. Martin')
    })
  })
  describe('and multiple blogs are available', function() {
    beforeEach(function() {
      cy.login({ username: 'jan kat', password: 'hallo123' })
      cy.createBlog({
        title: 'blog with most likes',
        author: 'author',
        url: 'blog.url',
        likes: 100
      })
      cy.createBlog({
        title: 'blog with third most likes',
        author: 'author',
        url: 'blog.url',
        likes: 25
      })
      cy.createBlog({
        title: 'blog with 2e most likes',
        author: 'author',
        url: 'blog.url',
        likes: 99
      })
      cy.createBlog({
        title: 'blog with no likes',
        author: 'author',
        url: 'blog.url',
        likes: 0
      })
    })
    it.only('The blogs are ordered corectly on likes', function() {
      cy.get('.blog').eq(0).should('contain', 'blog with most likes By author')
      cy.get('.blog').eq(1).should('contain', 'blog with 2e most likes')
      cy.get('.blog').eq(2).should('contain', 'blog with third most likes')
      cy.get('.blog').eq(3).should('contain', 'blog with no likes')

      cy.get('.blog').eq(1).contains('View').click()
      cy.get('.blog').eq(1).contains('Like').click()
      cy.get('.blog').eq(1).contains('Like').click()

      cy.get('.blog').eq(1).should('contain', 'blog with most likes By author')
      cy.get('.blog').eq(0).should('contain', 'blog with 2e most likes')
      cy.get('.blog').eq(2).should('contain', 'blog with third most likes')
      cy.get('.blog').eq(3).should('contain', 'blog with no likes')
    })

  })
})