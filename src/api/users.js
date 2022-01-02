import instance from '../api/axios'
const get_user_by_id = (id) => {
    return instance.get(`/users/${id}`)
};

export { get_user_by_id };