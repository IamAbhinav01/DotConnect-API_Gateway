import dotenv from 'dotenv';
dotenv.config();

const EnvConfiguration = {
	PORT: Number(process.env.PORT ?? 3000),
};

export default EnvConfiguration;
