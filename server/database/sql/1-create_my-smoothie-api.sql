create sequence user_account_seq start with 2 increment by 1;
CREATE TABLE IF NOT EXISTS user_account (id BIGINT DEFAULT NEXTVAL('user_account_seq') PRIMARY KEY, username VARCHAR(255), password VARCHAR(255));

create sequence conversation_seq start with 1 increment by 1;
CREATE TABLE IF NOT EXISTS conversation (id BIGINT DEFAULT NEXTVAL('conversation_seq') PRIMARY KEY, group VARCHAR(255));

create sequence conversation_user_seq start with 1 increment by 1;
CREATE TABLE IF NOT EXISTS conversation_user (id BIGINT DEFAULT NEXTVAL('conversation_user_seq') PRIMARY KEY, id_user INTEGER, id_conversation INTEGER, FOREIGN KEY(id_user) REFERENCES user_account(id), FOREIGN KEY(id_conversation) REFERENCES conversation(id));

create sequence message_seq start with 1 increment by 1;
CREATE TABLE IF NOT EXISTS message (id BIGINT DEFAULT NEXTVAL('message_seq') PRIMARY KEY, content VARCHAR(255), id_conversation INTEGER, FOREIGN KEY(id_conversation) REFERENCES conversation(id));


-- sequelize model:create --name User --attributes username:string,password:string,private:boolean,favorite:boolean
-- sequelize model:create --name Conversation --attributes group:boolean,description:string
-- sequelize model:create --name Message --attributes content:string,username:string,read:boolean,count:integer

-- sequelize migration:generate --name associate-user-conversation

-- sequelize migration:generate --name associate-user-contact
