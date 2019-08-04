# Medidor de velocidade da Internet
Este é um protótipo de UI (user interface / frontend) de um aplicativo que simula a medição da velocidade de download e upload de uma conexão com a Internet.
Um single page application (SPA) desenvolvido em HTML, CSS, e JavaScript com arquitetura MVC (Model-View-Controller).
Otimizado e servido com Webpack.

Para iniciar o servidor em `[localhost:8080](http://localhost:8080/)` utilize:
`npm start`

Estrutura de arquivos:
`docs/` mockup original em Adobe XD e GIF animado apresentando a interface gráfica
`src/` arquivos fonte do app
`dist/` arquivos gerados e otimizados para distribuição em produção

![](docs/speedtest-app-mockup.gif)

## Fluxograma
```flow
st=>start: Início
cond=>condition: Primeira vez?
res=>operation: Mostra nome e resultados
dwl=>operation: Mede download
upl=>operation: Mede upload
e=>end: Resultado

st->cond
cond(yes)->dwl
cond(no)->res
res->dwl
dwl->upl
upl->e
```