# turing-test-game-web

Frontend for the Turing Test Game. Deploy target: Vercel.

## Local Development

```powershell
pnpm install
pnpm dev
```

Open ​http://localhost:3000

## Production Build

```powershell
pnpm build
pnpm start
```

## Environment Variables

| Variable | Default | Description |
| :------- | :------ | :---------- |
| `NEXT_PUBLIC_SERVER_URL` | `http://localhost:4000` | Socket.IO server URL |
