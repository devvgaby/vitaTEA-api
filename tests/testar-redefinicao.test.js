// Testa o e-mail de redefinição de senha pelo terminal, SEM subir o servidor.
// Faz o mesmo que o app faz ao tocar em "Esqueci minha senha", mas mostra o resultado na hora.
//
// Uso (na pasta do backend):
//   node scripts/testar-redefinicao.js email_da_conta@gmail.com
//   node scripts/testar-redefinicao.js email@gmail.com --sem-banco     (só testa o envio, sem consultar o banco)
//   node scripts/testar-redefinicao.js email@gmail.com --mostrar-link  (imprime o link no terminal)
require("dotenv").config();

const args = process.argv.slice(2);
const email = args.find((a) => !a.startsWith("--"));
const semBanco = args.includes("--sem-banco");
const mostrarLink = args.includes("--mostrar-link");

const {
  enviarEmailRedefinicaoSenha,
  diagnosticarEmail,
  explicarErroSmtp,
  urlPublicaDoBackend,
} = require("../src/services/emailService");

const passo = (n, t) => console.log(`\n${n}) ${t}`);
const ok = (t) => console.log(`   OK: ${t}`);
const falha = (t) => console.log(`   PROBLEMA: ${t}`);

(async () => {
  if (!email) {
    console.error("Informe o e-mail. Ex.: node scripts/testar-redefinicao.js seuemail@gmail.com");
    process.exit(1);
  }

  console.log("=== Teste da redefinição de senha por e-mail ===");
  console.log("Este teste roda NESTE computador, com o .env e o banco daqui.");
  console.log("SMTP_HOST:", process.env.SMTP_HOST || "(vazio)", "| SMTP_USER:", process.env.SMTP_USER || "(vazio)");

  passo(1, "Conferindo SMTP (Gmail) e endereço público do link...");
  const problemas = await diagnosticarEmail();
  if (problemas.length) {
    problemas.forEach((p) => falha(p));
    console.log("\nCorrija o item acima no .env e rode de novo.");
    process.exit(1);
  }
  ok(`SMTP aceitou o login e o link usará ${urlPublicaDoBackend()}`);

  let resetToken;
  let nome = "teste";
  let destino = email;

  if (semBanco) {
    passo(2, "Pulando o banco (--sem-banco): usando um código de teste.");
    resetToken = require("jsonwebtoken").sign({ tipo: "reset_senha", id_cuidador: 0 }, "so-para-teste", { expiresIn: "30m" });
    console.log("   Atenção: o link deste e-mail NÃO funciona de verdade (é só para ver se o e-mail chega).");
  } else {
    passo(2, `Procurando a conta ${email} no banco deste computador...`);
    let resultado;
    try {
      resultado = await require("../src/services/authService").solicitarRedefinicaoSenha(email);
    } catch (erro) {
      falha(`não consegui consultar o banco (${erro.name}). O MySQL está ligado? Use --sem-banco para testar só o envio.`);
      process.exit(1);
    }
    if (!resultado) {
      falha("NÃO existe conta com esse e-mail neste banco. É exatamente por isso que, no app, a mensagem de 'enviamos' aparece mas nada chega: com e-mail não cadastrado a API não envia nada.");
      console.log("   Se a conta foi criada pelo app no servidor, ela está no banco do servidor, não neste. Use --sem-banco para testar só a entrega.");
      process.exit(1);
    }
    ok(`conta encontrada (id ${resultado.cuidador.id_cuidador})`);
    resetToken = resultado.resetToken;
    nome = resultado.cuidador.nome;
    destino = resultado.cuidador.email;
  }

  passo(3, `Enviando o e-mail de redefinição para ${destino}...`);
  try {
    await enviarEmailRedefinicaoSenha({ para: destino, nome, resetToken });
    ok("o Gmail ACEITOU a mensagem. Confira a caixa de entrada e o SPAM (pode levar alguns segundos).");
    if (mostrarLink) console.log(`   Link: ${urlPublicaDoBackend()}/auth/redefinir-senha?token=${encodeURIComponent(resetToken)}`);
  } catch (erro) {
    falha(`${erro.code || erro.name}: ${erro.message}`);
    const dica = explicarErroSmtp(erro);
    if (dica) console.log(`   O que fazer: ${dica}`);
    process.exit(1);
  }
  process.exit(0);
})().catch((e) => { console.error("Erro inesperado:", e.message); process.exit(1); });