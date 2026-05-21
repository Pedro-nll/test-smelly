const { UserService } = require('../src/userService');

describe('UserService — Clean Tests', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  test('creates a user and retrieves it by id (Arrange/Act/Assert)', () => {
    // Arrange
    const dados = { nome: 'Fulano', email: 'fulano@teste.com', idade: 25 };

    // Act
    const criado = userService.createUser(dados.nome, dados.email, dados.idade);

    // Assert
    expect(criado.id).toBeDefined();
    const buscado = userService.getUserById(criado.id);
    expect(buscado).not.toBeNull();
    expect(buscado.nome).toBe(dados.nome);
    expect(buscado.status).toBe('ativo');
  });

  test('deactivates a non-admin user', () => {
    // Arrange
    const usuario = userService.createUser('Comum', 'comum@teste.com', 30);

    // Act
    const resultado = userService.deactivateUser(usuario.id);

    // Assert
    expect(resultado).toBe(true);
    const atualizado = userService.getUserById(usuario.id);
    expect(atualizado.status).toBe('inativo');
  });

  test('does not deactivate an admin user', () => {
    // Arrange
    const admin = userService.createUser('Admin', 'admin@teste.com', 40, true);

    // Act
    const resultado = userService.deactivateUser(admin.id);

    // Assert
    expect(resultado).toBe(false);
    const atualizado = userService.getUserById(admin.id);
    expect(atualizado.status).toBe('ativo');
  });

  test('generateUserReport includes header and created users (behavioral check)', () => {
    // Arrange
    const u1 = userService.createUser('Alice', 'alice@email.com', 28);
    const u2 = userService.createUser('Bob', 'bob@email.com', 32);

    // Act
    const relatorio = userService.generateUserReport();

    // Assert — check behavior (contains header and identifying info), not exact formatting
    expect(relatorio).toContain('Relatório de Usuários');
    expect(relatorio).toContain(u1.id);
    expect(relatorio).toContain('Alice');
    expect(relatorio).toContain(u2.id);
    expect(relatorio).toContain('Bob');
  });

  test('generateUserReport indicates no users when DB is empty', () => {
    // Arrange — DB is already cleared in beforeEach

    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain('Nenhum usuário');
  });

  test('throws when creating an underage user', () => {
    // Arrange / Act / Assert
    expect(() => userService.createUser('Menor', 'menor@teste.com', 17)).toThrow(/maior de idade/);
  });
});
