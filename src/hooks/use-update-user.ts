import { NormalizedUser, updateUser } from '@/actions/user/controller';
import { UpdateUserDto } from '@/actions/user/types';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

type Options = Omit<
  UseMutationOptions<
    NormalizedUser,
    Error,
    Pick<UpdateUserDto, 'name' | 'password' | 'image'>
  >,
  'mutationFn'
>;

export default function useUpdateUser(options: Options = {}) {
  const { mutate, mutateAsync, ...mutation } = useMutation<
    NormalizedUser,
    Error,
    Pick<UpdateUserDto, 'name' | 'password' | 'image'>
  >({
    mutationFn: updateUser,
    ...options,
  });

  return {
    ...mutation,
    updateUser: mutate,
    updateUserAsync: mutateAsync,
  };
}
