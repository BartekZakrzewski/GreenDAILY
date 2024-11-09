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
        const EcoScore = await pb.collection("EcoScores").create({
            ecoscore: 0,
            user_id: _id,
        });
        return EcoScore;
    } catch (err) {
        throw new Error(err.message);
    }
};

export const createEcoJournal = async (_content, _date, _id) => {
    try {
        const EcoJournal = await pb.collection("EcoJournal").create({
            "content": _content,
            "user_id": _id,
            "date": _date
        })
        return EcoJournal;
    } catch (err) {
        throw new Error(err.message);
    }
}

export const getEcoScore = async (_user) => {
    try {
        const records = await pb
            .collection("GetEcoScore")
            .getFullList()
            .then((res) =>
                res.filter((record) => record.user_id == _user.id),
            );
        return records[0];
    } catch (err) {
        console.log(err.message);
    }
}

export const getEcoJournal = async (_user) => {
    try {
        const records = await pb
            .collection("GetEcoJournal")
            .getFullList()
            .then((res) =>
                res.filter((record) => record.user_id == _user.id),
            );
        return records;
    } catch (err) {
        console.log(err.message);
    }
}

export const updateEcoScore = async (_ecoscore_id, _ecoscore) => {
    try {
        const EcoScore = await pb.collection("EcoScores").update(_ecoscore_id, {
            ecoscore: _ecoscore,
        });
        return EcoScore;
    } catch (err) {
        throw new Error(err.message);
    }
};

export const updateEcoJournal = async (_id, _content) => {
    try {
        const EcoJournal = await pb.collection("EcoJournal").update(_id, {
            "content": _content
        })
        return EcoJournal
    } catch (err) {
        throw new Error(err.messae)
    }
}

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
