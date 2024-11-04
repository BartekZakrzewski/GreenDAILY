import pb from  '@/lib/pocketbase';

export const loginUser = async (email, password) => {
    try {
        const authData = await pb.collection('users').authWithPassword(email, password);
        console.log(authData);
        return authData;
    } catch (err) {
        throw new Error(err.message);
    }
}

export const signupUser = async (email, password) => {
    try {
        const user = await pb.collection('users').create({
            email,
            password,
            passwordConfirm: password,
        });
        return user;
    } catch (err) {
        throw new Error(err.message);
    }
}

export const logoutUser = () => {
    pb.authStore.clear();
}
