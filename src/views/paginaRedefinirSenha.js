// Páginas HTML simples da redefinição de senha (abertas pelo link do e-mail).
// Não usam JavaScript nem recursos externos: assim funcionam em qualquer
// navegador do celular e com a política de segurança (CSP) bem restritiva.

const escapar = (valor) =>
  String(valor ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const estilo = `
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;
       background:#0F0F1E;color:#F5F5FA;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
  .cartao{width:100%;max-width:420px;background:#1A1A2E;border:1px solid #2A2A40;border-radius:18px;padding:28px 24px}
  h1{margin:0 0 4px;font-size:26px;color:#7C3AED}
  h2{margin:16px 0 6px;font-size:20px}
  p{color:#8A8AA0;line-height:1.5;margin:6px 0}
  label{display:block;margin:16px 0 6px;font-size:14px;font-weight:600}
  input[type=password]{width:100%;padding:14px;border-radius:14px;border:1px solid #2A2A40;
       background:#0F0F1E;color:#F5F5FA;font-size:16px}
  input[type=password]:focus{outline:2px solid #7C3AED;border-color:#7C3AED}
  button,.botao{display:block;width:100%;margin-top:22px;padding:14px;border:0;border-radius:999px;
       background:#7C3AED;color:#fff;font-size:16px;font-weight:700;text-align:center;text-decoration:none;cursor:pointer}
  .erro{background:#EF444426;border:1px solid #EF4444;color:#FCA5A5;border-radius:14px;padding:12px;margin-top:14px;font-size:14px}
  .ok{background:#10B98126;border:1px solid #10B981;color:#6EE7B7;border-radius:14px;padding:12px;margin-top:14px;font-size:14px}
  strong{color:#F5F5FA}
`;

const pagina = (titulo, corpo) => `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>${escapar(titulo)} - VitaTEA</title>
  <style>${estilo}</style>
</head>
<body>
  <main class="cartao">
    <h1>VitaTEA</h1>
    ${corpo}
  </main>
</body>
</html>`;

const formulario = ({ token, emailMascarado, erro }) =>
  pagina(
    "Nova senha",
    `
    <h2>Criar nova senha</h2>
    <p>Conta: <strong>${escapar(emailMascarado)}</strong></p>
    ${erro ? `<div class="erro" role="alert">${escapar(erro)}</div>` : ""}
    <form method="POST" action="/auth/redefinir-senha/web" autocomplete="off">
      <input type="hidden" name="resetToken" value="${escapar(token)}">
      <label for="novaSenha">Nova senha</label>
      <input id="novaSenha" name="novaSenha" type="password" minlength="6" required
             autocomplete="new-password" placeholder="Mínimo 6 caracteres">
      <label for="confirmarSenha">Confirmar nova senha</label>
      <input id="confirmarSenha" name="confirmarSenha" type="password" minlength="6" required
             autocomplete="new-password" placeholder="Repita a nova senha">
      <button type="submit">Salvar nova senha</button>
    </form>`,
  );

const sucesso = () =>
  pagina(
    "Senha alterada",
    `
    <h2>Senha alterada!</h2>
    <div class="ok">Sua senha foi redefinida com sucesso.</div>
    <p>Volte ao aplicativo VitaTEA e entre com a nova senha.</p>
    <a class="botao" href="vitatea://login">Abrir o aplicativo</a>`,
  );

const linkInvalido = () =>
  pagina(
    "Link inválido",
    `
    <h2>Link inválido ou expirado</h2>
    <div class="erro" role="alert">Este link não pode mais ser usado. Ele vale por 30 minutos e só funciona uma vez.</div>
    <p>Abra o aplicativo VitaTEA, vá em "Esqueci minha senha" e peça um novo e-mail.</p>`,
  );

module.exports = { formulario, sucesso, linkInvalido };