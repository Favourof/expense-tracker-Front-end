export const inputs = [
    {
      name: "firstName",
      label: "Name",
      type: "text",
      placeholder: "Enter your first name",
      required: true,
    },

    {
        name: "gender",
        label: "Gender",
        type: "select",
        options: [
          {
            label: "Male",
            value: "male",
          },
          {
            label: "Female",
            value: "female",
          },
        ],
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "Enter your email",
        required: true,
      },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter your password",
      required: true,
    },
   
  ];