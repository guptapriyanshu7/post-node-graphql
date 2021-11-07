// Chakra ui theme toggler
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useColorMode, IconButton } from "@chakra-ui/react";

export default function ThemeToggler() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    // <Box textAlign="right" py={4} mr={12}>
    <IconButton
      icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      onClick={toggleColorMode}
      variant="ghost"
    />
    //</Box>
  );
}
