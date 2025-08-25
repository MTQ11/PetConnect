import { useAppDispatch, useAppSelector } from "@/store/hook";
import { getMyPets } from "@/store/slices/myPetsSlice";
import { useEffect } from "react";

export const useMyPetsData = () => {
    const dispatch = useAppDispatch();
    const { myPets, loading, error } = useAppSelector((state) => state.myPets);

    useEffect(() => {
        if (!myPets.length) {
            dispatch(getMyPets());
        }
    }, [dispatch, myPets.length]);

    return { myPets, loading, error };
}