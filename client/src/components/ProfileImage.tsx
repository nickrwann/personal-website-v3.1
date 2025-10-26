import profileImage from "@assets/generated_images/Professional_software_engineer_portrait_e44b99f5.png";

export function ProfileImage() {
  return (
    <div className="flex justify-center mb-6" data-testid="container-profile">
      <div className="relative">
        <img
          src={profileImage}
          alt="Nick Wanner"
          className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover ring-4 ring-white shadow-lg"
          data-testid="img-profile"
        />
      </div>
    </div>
  );
}
