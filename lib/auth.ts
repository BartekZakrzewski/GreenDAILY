import pb from "@/lib/pocketbase";

export const loginUser = async (email, password) => {
    try {
        const authData = await pb
            .collection("users")
            .authWithPassword(email, password);
        return authData;
    } catch (err) {
        throw new Error(err.message);
    }
};

export const createEcoScore = async (_id) => {
    try {
        const EcoScore = await pb.collection("ecoScores").create({
            ecoscore: 0,
            user_id: _id,
        });
        return EcoScore;
    } catch (err) {
        throw new Error(err.message);
    }
};

export const signupUser = async (email, password, passwordConfirm) => {
    try {
        const user = await pb.collection("users").create({
            email,
            password,
            passwordConfirm,
        });
        await createEcoScore(user.id);
        return user;
    } catch (err) {
        throw new Error(err.message);
    }
};

export const logoutUser = () => {
    pb.authStore.clear();
};
