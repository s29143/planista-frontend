import { Button } from "@mantine/core";
import { useTranslation } from "react-i18next";

const CancelButton = () => {
  const { t } = useTranslation();
  return (
    <Button variant="default" type="button" onClick={() => history.back()}>
      {t("actions.cancel")}
    </Button>
  );
};

export default CancelButton;
