import {
  useFocusEffect,
  useRovingTabIndex,
} from "@getoutline/react-roving-tabindex";
import { observer } from "mobx-react";
import * as React from "react";
import { Link } from "react-router-dom";
import Collection from "~/models/Collection";
import Icon from "../Icon";

type Props = {
  collection: Collection;
  highlight?: string | undefined;
  context?: string | undefined;
  showParentDocuments?: boolean;
  showCollection?: boolean;
  showPublished?: boolean;
  showPin?: boolean;
  showDraft?: boolean;
  showTemplate?: boolean;
};

function CollectionItem(props: Props, ref: React.RefObject<HTMLAnchorElement>) {
  let itemRef: React.Ref<HTMLAnchorElement> =
    React.useRef<HTMLAnchorElement>(null);
  if (ref) {
    itemRef = ref;
  }

  const { focused, ...rovingTabIndex } = useRovingTabIndex(itemRef, false);
  useFocusEffect(focused, itemRef);

  const { collection } = props;

  return (
    <Link to={collection.path}>
      <>
        {collection.icon ? (
          <Icon value={collection.icon} color={collection.color || undefined} />
        ) : null}
        {collection.name}
      </>
    </Link>
  );
}

export default observer(React.forwardRef(CollectionItem));
