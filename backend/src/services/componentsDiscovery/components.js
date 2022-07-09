const getFile = async () => ({
	groups: (await import('../../components/groups/index.js')).default,
	auth: (await import('../../components/auth/index.js')).default,
	dataBaseManager: (await import('../../components/dataBaseManager/index.js')).default,
	users: (await import('../../components/users/index.js')).default
}); 

export default getFile();
