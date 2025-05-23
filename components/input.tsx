import { cn } from "@/lib/utils";
import React from "react";
import { Control, Controller } from "react-hook-form";
import { Text, TextInput, TextInputProps, View } from "react-native";

interface InputProps extends TextInputProps {
  label: string;
  name: string;
  control: Control<any>;
  errorMessage?: string;
  className?: string;
}

const Input = ({ label, control, errorMessage, className, name, ...props }: InputProps) => {
  return (
    <View>
      <Text className="text-gray-700 mb-2">{label}</Text>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            {...props}
            className={cn("w-full p-4 bg-gray-50 rounded-lg border border-gray-200 placeholder:text-gray-400", className)}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name={name}
      />
      {errorMessage && <Text className="text-red-500 text-sm">{errorMessage}</Text>}
    </View>
  );
};

export default Input;
