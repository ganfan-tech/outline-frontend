import * as React from "react";
import Collection from "~/models/Collection";
import CollectionItem from "./CollectionItem";

type Props = {
  collections: Collection[];
  fetch?: (options: any) => Promise<Collection[] | undefined>;
  options?: Record<string, any>;
  heading?: React.ReactNode;
  empty?: React.ReactNode;
  showParentDocuments?: boolean;
  showCollection?: boolean;
  showPublished?: boolean;
  showDraft?: boolean;
  showTemplate?: boolean;
};

const CollectionList = React.memo<Props>(function CollectionList({
  collections,
  options,
  showParentDocuments,
  showCollection,
  showPublished,
  showTemplate,
  showDraft,
}: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
      }}
    >
      {collections.map((item) => (
        <CollectionItem
          key={item.id}
          collection={item}
          showPin={!!options?.collectionId}
          showParentDocuments={showParentDocuments}
          showCollection={showCollection}
          showPublished={showPublished}
          showTemplate={showTemplate}
          showDraft={showDraft}
        />
      ))}
    </div>
  );
});

export default CollectionList;
