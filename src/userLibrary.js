class User{

    user = {
        email: "felix.fuin@nokia.com",
        lastname: "Félix",
        name: "Fuin",
        location: "Paris-Saclay"
    };

    set(user){
        this.user = user;
    }

    get(){
        return this.user;
    }
}
export default new User();

