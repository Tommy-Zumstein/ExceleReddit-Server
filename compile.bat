@echo off
echo Compiling typescript
call tsc .\app.ts
echo Running node
call node .\app.js