import {Composition, registerRoot} from 'remotion';
import {ArtHistory} from './ArtHistory';
import {VIDEO} from '../timeline';

const Root = () => <Composition id="ArtHistory" component={ArtHistory} durationInFrames={VIDEO.frames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} defaultProps={{withAudio:true}} />;
registerRoot(Root);
