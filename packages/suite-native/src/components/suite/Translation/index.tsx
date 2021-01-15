import React from 'react';
import BaseTranslation from '@suite/components/suite/Translation/components/BaseTranslation';

type TranslationProps = Omit<React.ComponentProps<typeof BaseTranslation>, 'translationTooltip'>;
const Translation = (props: TranslationProps) => {
    return <BaseTranslation {...props} translationTooltip={() => null} />;
};

export default Translation;
