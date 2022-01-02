import instance from '../api/axios'
const get_user_by_id = async(id) => {
    return await instance.get(`/users/${id}`)
};
const register_user = async(email) => {
  return await instance.post(`/users/register`, {user:{email:email}})
};

export { get_user_by_id, register_user };