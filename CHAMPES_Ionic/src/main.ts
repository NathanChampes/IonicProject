import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { Buffer } from 'buffer';

window.Buffer = Buffer;

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
