import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { getCurrentUser } from "@/features/AuthPage/AuthSlice";

const CurrentUserComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);
  const status = useSelector((state) => state.auth.status);
  const error = useSelector((state) => state.auth.error);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    let timer;
    if (!currentUser) {
      timer = setTimeout(() => {
        toast({
          title: "Hello",
          description: "Your token has expired. Please log in.",
        });
        navigate("/login");
      }, 20000);
    }else{
      navigate('/dashboard')
    }
    return () => clearTimeout(timer);
  }, [currentUser, navigate]);

  if (status === "loading") {
    return <h1>Loading...</h1>;
  }

  if (error) {
    toast({
      title: "Hello",
      description: "Your token has expired. Please log in.",
    });
  }

  return (
    <div>
      {currentUser? (
        <div>
          <h1>Welcome, {currentUser.firstName}</h1>
          <p>{currentUser._id}</p>
          {/* Render more user info here */}
        </div>
      ) : (
        <div>No user data</div>
      )}
    </div>
  );
};

export default CurrentUserComponent;
