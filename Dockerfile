FROM node:14-bullseye
COPY . /
RUN yarn
EXPOSE 3000
CMD ["yarn", "start"]