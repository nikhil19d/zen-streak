FROM node:18-alpine AS development
RUN npm install -g pnpm@latest
WORKDIR /work/project
COPY package* ./
RUN pnpm install
COPY . .
EXPOSE 3000
CMD [ "pnpm","run","dev" ]

FROM node:18-alpine AS builder
RUN npm install -g pnpm@latest
WORKDIR /work/project
COPY package* pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
ARG DIRECT_URL
ENV DIRECT_URL=$DIRECT_URL
RUN pnpm prisma generate && pnpm run build


FROM node:18-alpine AS production
RUN npm install -g pnpm@latest
WORKDIR /work/project
COPY --from=builder /work/project/node_modules ./node_modules
COPY --from=builder /work/project/.next ./.next
COPY --from=builder /work/project/package.json ./package.json
COPY --from=builder /work/project/prisma ./prisma
EXPOSE 3000
CMD [ "sh","-c","pnpm prisma migrate deploy && pnpm run start" ]
